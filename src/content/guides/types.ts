export interface GuideSection {
  heading: string;
  paragraphs: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  updatedDate: string;
  readingMinutes: number;
  practiceMode: string;
  practiceModeLabel: string;
  relatedSlugs: string[];
  sections: GuideSection[];
}
