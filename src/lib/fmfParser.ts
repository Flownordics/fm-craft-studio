import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  commonName?: string;
  dateOfBirth: string;
  nationality: string;
  club?: string;
  position: string;
  ability: number;
  potential: number;
  value: number;
}

export interface Club {
  id: string;
  name: string;
  shortName?: string;
  nation: string;
  reputation: number;
  balance: number;
  stadium?: string;
}

export interface Competition {
  id: string;
  name: string;
  shortName?: string;
  nation: string;
  type: string;
  reputation: number;
}

export interface FMFData {
  players: Player[];
  clubs: Club[];
  competitions: Competition[];
  rawXml: { [filename: string]: any };
}

export async function parseFMFFile(file: File): Promise<FMFData> {
  try {
    // Load the .fmf file as a zip archive
    const zip = await JSZip.loadAsync(file);
    
    const xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true,
    });

    const rawXml: { [filename: string]: any } = {};
    const players: Player[] = [];
    const clubs: Club[] = [];
    const competitions: Competition[] = [];

    // Extract and parse all XML files
    for (const [filename, fileData] of Object.entries(zip.files)) {
      if (filename.endsWith('.xml') && !fileData.dir) {
        const xmlContent = await fileData.async('string');
        const parsed = xmlParser.parse(xmlContent);
        rawXml[filename] = parsed;

        // Parse players
        if (filename.toLowerCase().includes('player')) {
          const parsedPlayers = extractPlayers(parsed);
          players.push(...parsedPlayers);
        }

        // Parse clubs
        if (filename.toLowerCase().includes('club') || filename.toLowerCase().includes('team')) {
          const parsedClubs = extractClubs(parsed);
          clubs.push(...parsedClubs);
        }

        // Parse competitions
        if (filename.toLowerCase().includes('comp') || filename.toLowerCase().includes('league')) {
          const parsedCompetitions = extractCompetitions(parsed);
          competitions.push(...parsedCompetitions);
        }
      }
    }

    return {
      players,
      clubs,
      competitions,
      rawXml,
    };
  } catch (error) {
    console.error('Error parsing FMF file:', error);
    throw new Error('Failed to parse FMF file. Please ensure it is a valid Football Manager .fmf file.');
  }
}

function extractPlayers(xmlData: any): Player[] {
  const players: Player[] = [];
  
  try {
    // Try to find player records in common XML structures
    const records = findRecords(xmlData, ['player', 'record', 'person']);
    
    records.forEach((record: any, index: number) => {
      players.push({
        id: record['@_id'] || record.id || `player_${index}`,
        firstName: record['@_first_name'] || record.first_name || record.firstName || 'Unknown',
        lastName: record['@_last_name'] || record.last_name || record.lastName || 'Player',
        commonName: record['@_common_name'] || record.common_name || record.commonName,
        dateOfBirth: record['@_date_of_birth'] || record.date_of_birth || record.dateOfBirth || 'Unknown',
        nationality: record['@_nation'] || record.nation || record.nationality || 'Unknown',
        club: record['@_club'] || record.club || record.team,
        position: record['@_position'] || record.position || 'Unknown',
        ability: parseInt(record['@_current_ability'] || record.current_ability || record.ability || '50'),
        potential: parseInt(record['@_potential_ability'] || record.potential_ability || record.potential || '50'),
        value: parseInt(record['@_value'] || record.value || '0'),
      });
    });
  } catch (error) {
    console.warn('Error extracting players:', error);
  }
  
  return players;
}

function extractClubs(xmlData: any): Club[] {
  const clubs: Club[] = [];
  
  try {
    const records = findRecords(xmlData, ['club', 'team', 'record']);
    
    records.forEach((record: any, index: number) => {
      clubs.push({
        id: record['@_id'] || record.id || `club_${index}`,
        name: record['@_name'] || record.name || 'Unknown Club',
        shortName: record['@_short_name'] || record.short_name || record.shortName,
        nation: record['@_nation'] || record.nation || record.country || 'Unknown',
        reputation: parseInt(record['@_reputation'] || record.reputation || '0'),
        balance: parseInt(record['@_balance'] || record.balance || record.cash || '0'),
        stadium: record['@_stadium'] || record.stadium,
      });
    });
  } catch (error) {
    console.warn('Error extracting clubs:', error);
  }
  
  return clubs;
}

function extractCompetitions(xmlData: any): Competition[] {
  const competitions: Competition[] = [];
  
  try {
    const records = findRecords(xmlData, ['competition', 'league', 'record']);
    
    records.forEach((record: any, index: number) => {
      competitions.push({
        id: record['@_id'] || record.id || `comp_${index}`,
        name: record['@_name'] || record.name || 'Unknown Competition',
        shortName: record['@_short_name'] || record.short_name || record.shortName,
        nation: record['@_nation'] || record.nation || record.country || 'Unknown',
        type: record['@_type'] || record.type || 'League',
        reputation: parseInt(record['@_reputation'] || record.reputation || '0'),
      });
    });
  } catch (error) {
    console.warn('Error extracting competitions:', error);
  }
  
  return competitions;
}

function findRecords(obj: any, possibleKeys: string[]): any[] {
  if (!obj || typeof obj !== 'object') return [];
  
  // Check if current object is an array
  if (Array.isArray(obj)) return obj;
  
  // Check if any of the possible keys exist at this level
  for (const key of possibleKeys) {
    if (obj[key]) {
      const value = obj[key];
      if (Array.isArray(value)) return value;
      if (typeof value === 'object') return [value];
    }
  }
  
  // Recursively search through nested objects
  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const found = findRecords(value, possibleKeys);
      if (found.length > 0) return found;
    }
  }
  
  return [];
}
