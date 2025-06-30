// This assumes that the logs are exported from Google Cloud logging into
//  a .json file in the logs directory with the name "gno-2025-cloud-logs.json".
// The logs are then processed to extract relevant information and stored in logs.json.

type RawLog = {
  insertId: string;
  jsonPayload: {
    message: string;
    [key: string]: any;
  };
  resource: {
    type: string;
    labels: {
      [key: string]: string;
    };
  };
  timestamp: string;
}

const logs: RawLog[] = require('../gno-2025-cloud-logs.json');
const people = ['Govie', 'Jac.', 'Simon', 'Lisa', 'Marjolein', 'Tim'];

/**
 * Gets the location from an input message.
 *
 * Example Input: "Govie entered activation [location]"
 * Example Output: "location"
 *
 * @param message The message string from the log entry.
 */
const getLocationOf = (message: string): string => {
  const match = message.match(/\[([^\]]+)\]/);
  return match ? match[1] : 'Unknown';
}

console.info(Object.entries(logs
  .filter(r => ['entered activation'].some(needle => r.jsonPayload.message.includes(needle)))
  .map(r => ({
    timestamp: r.timestamp.slice(11, 19),
    person: people.find(person => r.jsonPayload.message.includes(person)) || 'Unknown',
    location: getLocationOf(r.jsonPayload.message),
  }))
  .reduce((acc, curr) => {
    const [hours, minutes, seconds] = curr.timestamp.split(':');
    const val = `${curr.person}@${Number.parseInt(hours, 10)+2}:${minutes}:${seconds}`;
    if (curr.location in acc) {
      acc[curr.location].push(val);
    } else {
      acc[curr.location] = [val];
    }
    return acc;
  }, {} as { [key: string]: string[] }))
  .map(([k, v]) => `${k}\n${v.join(', ')}\n`).join('\n')
);
