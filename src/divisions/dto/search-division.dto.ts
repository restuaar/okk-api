export class SearchDivisionDto {
  nama?: string;
  page?: number;
  size?: number;
  onlyPI?: boolean;
  onlyBPH?: boolean;
  option?: OptionSearchDivision;
}

class OptionSearchDivision {
  includePengurus?: boolean;
  includeDivisi?: boolean;
  includeRapat?: boolean;
  includeAnggota?: boolean;
}
