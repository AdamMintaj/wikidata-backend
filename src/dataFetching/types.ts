export interface Entity {
  description: string;
  height: number;
  id: string;
  image: string;
  name: string;
}

export interface UnfilteredWikiData {
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
