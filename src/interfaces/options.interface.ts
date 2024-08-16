export class PIDivisionOptions {
  includePengurus: boolean = true;
  includeDivisi: boolean = false;
}

export class BPHDivisionOptions {
  includeAnggota: boolean = true;
  includeDivisi: boolean = false;
  includeRapat: boolean = false;
}

export class SearchDivisionOptions {
  PI: PIDivisionOptions;
  BPH: BPHDivisionOptions;
}

export class OrganizerOptions {
  includeRapat: boolean = false;
  includeDivisi: boolean = false;
}

export class GroupOptions {
  includeMentor: boolean = true;
  includeAnggota: boolean = false;
  includeMentoring: boolean = false;
}

export class MenteeOptions {
  includeAkun: boolean = false;
  includeGroup: boolean = true;
  includeMentoring: boolean = false;
}

export class EventOptions {
  includePembicara: boolean = false;
  includeSponsor: boolean = false;
}

export class SponsorOptions {
  includeAcara: boolean = false;
  includeAkun: boolean = false;
}
