const assert = require('assert');

// Episode parser testing
function parseEpisodeTitle(rawTitle, defaultSeason = 1) {
  if (!rawTitle) {
    return { seasonNumber: defaultSeason, episodeNumber: 1, cleanTitle: 'Episode 1' };
  }

  // 1. S01E02, s1e2
  const sPattern = /S(\d+)[._\s\-:]*E(?:pisode)?[._\s\-:]*(\d+)/i;
  const sMatch = rawTitle.match(sPattern);
  if (sMatch) {
    return {
      seasonNumber: parseInt(sMatch[1], 10),
      episodeNumber: parseInt(sMatch[2], 10),
      cleanTitle: `Episode ${parseInt(sMatch[2], 10)}`,
    };
  }

  // 2. Season 1 Episode 2
  const seasonEpPattern = /Season[._\s\-:]*(\d+)[._\s\-:]*(?:Episode|Ep)[._\s\-:]*(\d+)/i;
  const seasonEpMatch = rawTitle.match(seasonEpPattern);
  if (seasonEpMatch) {
    return {
      seasonNumber: parseInt(seasonEpMatch[1], 10),
      episodeNumber: parseInt(seasonEpMatch[2], 10),
      cleanTitle: `Episode ${parseInt(seasonEpMatch[2], 10)}`,
    };
  }

  // 3. 1x02
  const xPattern = /(\d+)x(\d+)/i;
  const xMatch = rawTitle.match(xPattern);
  if (xMatch) {
    return {
      seasonNumber: parseInt(xMatch[1], 10),
      episodeNumber: parseInt(xMatch[2], 10),
      cleanTitle: `Episode ${parseInt(xMatch[2], 10)}`,
    };
  }

  // 4. S1.Episode:2 or S:1E:2
  const colonPattern = /S:?(\d+)[:.]*(?:Episode:?|E:?)(\d+)/i;
  const colonMatch = rawTitle.match(colonPattern);
  if (colonMatch) {
    return {
      seasonNumber: parseInt(colonMatch[1], 10),
      episodeNumber: parseInt(colonMatch[2], 10),
      cleanTitle: `Episode ${parseInt(colonMatch[2], 10)}`,
    };
  }

  // 5. Episode 2
  const epOnlyPattern = /(?:Episode|Ep)[._\s\-:]*(\d+)/i;
  const epOnlyMatch = rawTitle.match(epOnlyPattern);
  if (epOnlyMatch) {
    return {
      seasonNumber: defaultSeason,
      episodeNumber: parseInt(epOnlyMatch[1], 10),
      cleanTitle: `Episode ${parseInt(epOnlyMatch[1], 10)}`,
    };
  }

  return {
    seasonNumber: defaultSeason,
    episodeNumber: 1,
    cleanTitle: rawTitle.replace(/\.[a-zA-Z0-9]+$/, '').replace(/_/g, ' '),
  };
}

function runTests() {
  console.log('--- Running NEXORA Episode Parser Tests ---');

  // Test 1: S01E02
  const t1 = parseEpisodeTitle('The.Kings.Avatar.S01E02.1080p.NF.WEB-DL.mkv');
  assert.strictEqual(t1.seasonNumber, 1, 'T1 Season should be 1');
  assert.strictEqual(t1.episodeNumber, 2, 'T1 Episode should be 2');
  console.log('✓ Test 1 Passed: S01E02 format correctly parsed');

  // Test 2: S1.Episode:2
  const t2 = parseEpisodeTitle('The King’S Avatar.S1.Episode:2');
  assert.strictEqual(t2.seasonNumber, 1, 'T2 Season should be 1');
  assert.strictEqual(t2.episodeNumber, 2, 'T2 Episode should be 2');
  console.log('✓ Test 2 Passed: S1.Episode:2 format correctly parsed');

  // Test 3: Season 2 Episode 5
  const t3 = parseEpisodeTitle('Breaking Bad Season 2 Episode 5 1080p');
  assert.strictEqual(t3.seasonNumber, 2, 'T3 Season should be 2');
  assert.strictEqual(t3.episodeNumber, 5, 'T3 Episode should be 5');
  console.log('✓ Test 3 Passed: "Season 2 Episode 5" format correctly parsed');

  // Test 4: 3x14
  const t4 = parseEpisodeTitle('Friends.3x14.DVDRip.x264');
  assert.strictEqual(t4.seasonNumber, 3, 'T4 Season should be 3');
  assert.strictEqual(t4.episodeNumber, 14, 'T4 Episode should be 14');
  console.log('✓ Test 4 Passed: "3x14" format correctly parsed');

  // Test 5: S:1E:8
  const t5 = parseEpisodeTitle('Anime.S:1E:8.mkv');
  assert.strictEqual(t5.seasonNumber, 1, 'T5 Season should be 1');
  assert.strictEqual(t5.episodeNumber, 8, 'T5 Episode should be 8');
  console.log('✓ Test 5 Passed: "S:1E:8" format correctly parsed');

  console.log('\nAll 5 Parser Unit Tests Passed Successfully!\n');
}

runTests();

