/**
 * SPARQL query for fetching data from wikidata. It searches for:
 *
 * - instances of humans,
 * - their name,
 * - short description,
 * - who have their height and image included
 *
 * Additionally it includes the height unit and number of sitelinks.
 * Only hits with more than 100 sitelinks are returned - this ensures no random
 * and unknown people are included.
 *
 * The query is limited to 500 results - this ensures that wikidata doesn't put its own cap
 * on the query, which is much lower (without the limit the query returns about 70 results, with
 * the limit its roughly 300).
 *
 * Generally it's good to experiment with the query, sometimes a seemingly minor change, like
 * not including number of sitelinks, can influence how many entries are returned.
 */
const query = `SELECT DISTINCT ?item ?itemLabel ?itemDescription ?sitelinks ?image ?heightValue ?heightUnitLabel
WHERE {
?item wdt:P31 wd:Q5; wdt:P18 ?image; wikibase:sitelinks ?sitelinks.
FILTER(?sitelinks > 100)
?item p:P2048 ?heightStatement.
?heightStatement psn:P2048 ?heightNode.
?heightNode wikibase:quantityAmount ?heightValue.
?heightNode wikibase:quantityUnit ?heightUnit.
SERVICE wikibase:label {
bd:serviceParam wikibase:language "en".
?item rdfs:label ?itemLabel.
?item schema:description ?itemDescription.
?heightUnit rdfs:label ?heightUnitLabel.
}
}
ORDER BY DESC(?sitelinks)
LIMIT 500`;

export default query;
