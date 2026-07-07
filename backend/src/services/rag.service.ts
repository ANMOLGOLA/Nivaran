import fs from 'fs';
import path from 'path';

interface SchemeFAQ {
  question: string;
  answer: string;
}

interface SchemeData {
  name: string;
  benefits: string;
  eligibility: string;
  requiredDocuments: string[];
  faq: SchemeFAQ[];
}

export interface SearchResult {
  source: string;
  text: string;
  score: number;
}

class RagService {
  private schemes: SchemeData[] = [];

  constructor() {
    this.loadSchemes();
  }

  private loadSchemes() {
    const dataDir = path.resolve(__dirname, '../data/schemes');
    try {
      if (!fs.existsSync(dataDir)) {
        console.warn(`Schemes directory does not exist at ${dataDir}`);
        return;
      }
      const files = fs.readdirSync(dataDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(dataDir, file);
          const rawData = fs.readFileSync(filePath, 'utf8');
          const scheme = JSON.parse(rawData) as SchemeData;
          this.schemes.push(scheme);
        }
      }
      console.log(`Loaded ${this.schemes.length} schemes for RAG service`);
    } catch (error) {
      console.error('Failed to load schemes in RagService:', error);
    }
  }

  public searchSchemes(query: string): SearchResult[] {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();
    const tokens = lowerQuery.split(/\s+/).filter(t => t.length > 2);
    const results: SearchResult[] = [];

    for (const scheme of this.schemes) {
      // Check for benefits match
      let benefitsScore = this.calculateMatchScore(scheme.benefits.toLowerCase(), tokens);
      if (scheme.name.toLowerCase().includes(lowerQuery) || tokens.some(t => scheme.name.toLowerCase().includes(t))) {
        benefitsScore += 2; // Boost if scheme name matches
      }
      if (benefitsScore > 0) {
        results.push({
          source: scheme.name,
          text: `Benefits: ${scheme.benefits}`,
          score: benefitsScore
        });
      }

      // Check for eligibility match
      const eligibilityScore = this.calculateMatchScore(scheme.eligibility.toLowerCase(), tokens);
      if (eligibilityScore > 0) {
        results.push({
          source: scheme.name,
          text: `Eligibility: ${scheme.eligibility}`,
          score: eligibilityScore
        });
      }

      // Check for required documents match
      const docText = scheme.requiredDocuments.join(', ').toLowerCase();
      const docScore = this.calculateMatchScore(docText, tokens);
      if (docScore > 0) {
        results.push({
          source: scheme.name,
          text: `Required Documents: ${scheme.requiredDocuments.join(', ')}`,
          score: docScore
        });
      }

      // Check FAQs match
      for (const faq of scheme.faq) {
        const faqScore = this.calculateMatchScore((faq.question + ' ' + faq.answer).toLowerCase(), tokens);
        if (faqScore > 0) {
          results.push({
            source: scheme.name,
            text: `Q: ${faq.question} | A: ${faq.answer}`,
            score: faqScore
          });
        }
      }
    }

    // Sort by score descending
    return results.sort((a, b) => b.score - a.score);
  }

  private calculateMatchScore(text: string, tokens: string[]): number {
    let score = 0;
    for (const token of tokens) {
      if (text.includes(token)) {
        score += 1;
      }
    }
    return score;
  }
}

export const ragService = new RagService();
