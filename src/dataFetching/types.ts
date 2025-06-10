export interface Timestamp {
  timestamp: Date;
}

export interface Entity {
  id: string;
  name: string;
  description: string;
  height: number;
  image: string;
}

export interface UnfilteredWikidata {
  head: Head;
  results: Results;
}

interface Binding {
  heightUnitLabel: Data;
  heightValue: Data;
  image: Data;
  item: Data;
  itemDescription: Data;
  itemLabel: Data;
  sitelinks: Data;
}

interface Data {
  datatype?: string;
  type: string;
  value: string;
  "xml:lang"?: string;
}

interface Head {
  vars: string[];
}

interface Results {
  bindings: Binding[];
}
