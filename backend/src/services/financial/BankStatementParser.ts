import {
  BANK_TRANSACTION_TYPE,
  BankTransactionType,
  FINANCIAL_CATEGORY,
  FinancialCategory,
} from "../../shared/constants/bankStatement";

export interface ParsedTransaction {
  transactionDate: Date;
  description: string;
  normalizedDescription: string;
  merchant: string;
  referenceId?: string;
  amount: number;
  type: BankTransactionType;
  balance?: number;
  category: FinancialCategory;
}

export interface ParsedStatement {
  bankName: string;
  periodStart?: Date;
  periodEnd?: Date;
  transactions: ParsedTransaction[];
}

const categoryRules: Array<{
  category: FinancialCategory;
  keywords: string[];
}> = [
  {
    category: FINANCIAL_CATEGORY.FOOD,
    keywords: [
      "SWIGGY",
      "ZOMATO",
      "RESTAURANT",
      "CAFE",
      "FOOD",
      "DOMINOS",
    ],
  },
  {
    category: FINANCIAL_CATEGORY.TRAVEL,
    keywords: [
      "IRCTC",
      "UBER",
      "OLA",
      "FLIGHT",
      "RAIL",
      "METRO",
      "HOTEL",
    ],
  },
  {
    category: FINANCIAL_CATEGORY.BILLS,
    keywords: [
      "ELECTRICITY",
      "BILL",
      "AIRTEL",
      "JIO",
      "VODAFONE",
      "BROADBAND",
      "WIFI",
    ],
  },
  {
    category: FINANCIAL_CATEGORY.SHOPPING,
    keywords: [
      "AMAZON",
      "FLIPKART",
      "MYNTRA",
      "SHOP",
      "RETAIL",
    ],
  },
  {
    category:
      FINANCIAL_CATEGORY.ENTERTAINMENT,
    keywords: [
      "NETFLIX",
      "PRIME",
      "HOTSTAR",
      "BOOKMYSHOW",
      "SPOTIFY",
      "YOUTUBE",
    ],
  },
  {
    category: FINANCIAL_CATEGORY.EMI,
    keywords: [
      "EMI",
      "LOAN",
      "NACH",
      "ECS",
    ],
  },
  {
    category: FINANCIAL_CATEGORY.RENT,
    keywords: [
      "RENT",
      "HOUSE",
      "LANDLORD",
    ],
  },
  {
    category: FINANCIAL_CATEGORY.FUEL,
    keywords: [
      "PETROL",
      "FUEL",
      "HPCL",
      "BPCL",
      "IOCL",
    ],
  },
  {
    category:
      FINANCIAL_CATEGORY.INVESTMENT,
    keywords: [
      "MUTUAL",
      "SIP",
      "ZERODHA",
      "GROWW",
      "UPSTOX",
    ],
  },
  {
    category: FINANCIAL_CATEGORY.SALARY,
    keywords: [
      "SALARY",
      "PAYROLL",
      "WAGES",
    ],
  },
  {
    category: FINANCIAL_CATEGORY.ATM,
    keywords: [
      "ATM",
      "CASH WDL",
      "CASH WITHDRAWAL",
    ],
  },
  {
    category: FINANCIAL_CATEGORY.TRANSFER,
    keywords: [
      "UPI",
      "NEFT",
      "IMPS",
      "RTGS",
      "TRANSFER",
    ],
  },
  {
    category: FINANCIAL_CATEGORY.INSURANCE,
    keywords: [
      "INSURANCE",
      "POLICY",
      "LIC",
    ],
  },
  {
    category: FINANCIAL_CATEGORY.EDUCATION,
    keywords: [
      "SCHOOL",
      "COLLEGE",
      "TUITION",
      "COURSE",
    ],
  },
  {
    category:
      FINANCIAL_CATEGORY.HEALTHCARE,
    keywords: [
      "HOSPITAL",
      "PHARMACY",
      "MEDICAL",
      "CLINIC",
    ],
  },
];

const datePattern =
  /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})/;

export class BankStatementParser {
  parse(
    file: Express.Multer.File,
  ): ParsedStatement {
    if (
      file.size < 100
    ) {
      throw new Error(
        "Fake or empty statement detected",
      );
    }

    const text =
      this.extractText(file);

    if (
      text.trim().length < 40
    ) {
      throw new Error(
        "Corrupted or unreadable statement",
      );
    }

    if (
      /\/Encrypt|password protected|encrypted/i.test(
        text,
      )
    ) {
      throw new Error(
        "Password protected statements are not supported",
      );
    }

    const transactions =
      this.parseRows(text);

    if (
      transactions.length === 0
    ) {
      throw new Error(
        "No valid bank transactions found",
      );
    }

    const dates =
      transactions.map(
        (transaction) =>
          transaction.transactionDate,
      );

    return {
      bankName: this.detectBankName(
        text,
      ),
      periodStart: new Date(
        Math.min(
          ...dates.map((date) =>
            date.getTime(),
          ),
        ),
      ),
      periodEnd: new Date(
        Math.max(
          ...dates.map((date) =>
            date.getTime(),
          ),
        ),
      ),
      transactions,
    };
  }

  private extractText(
    file: Express.Multer.File,
  ): string {
    return file.buffer.toString(
      file.mimetype === "application/pdf"
        ? "latin1"
        : "utf8",
    );
  }

  private parseRows(
    text: string,
  ): ParsedTransaction[] {
    const rows =
      text.split(/\r?\n/);

    return rows
      .map((row) =>
        this.parseRow(row),
      )
      .filter(
        (
          item,
        ): item is ParsedTransaction =>
          item !== null,
      );
  }

  private parseRow(
    row: string,
  ): ParsedTransaction | null {
    const normalizedRow =
      row.replace(/\t/g, ",").trim();

    const dateMatch =
      normalizedRow.match(
        datePattern,
      );

    if (!dateMatch) {
      return null;
    }

    const transactionDate =
      this.parseDate(dateMatch[1]);

    if (!transactionDate) {
      return null;
    }

    const cells =
      normalizedRow
        .split(/,|\s{2,}/)
        .map((cell) => cell.trim())
        .filter(Boolean);

    const amounts =
      cells
        .map((cell) =>
          this.parseAmount(cell),
        )
        .filter(
          (amount): amount is number =>
            amount !== null,
        );

    if (amounts.length === 0) {
      return null;
    }

    const lowerRow =
      normalizedRow.toLowerCase();

    const type =
      lowerRow.includes("credit") ||
      lowerRow.includes(" cr") ||
      lowerRow.includes(",cr")
        ? BANK_TRANSACTION_TYPE.CREDIT
        : BANK_TRANSACTION_TYPE.DEBIT;

    const amount =
      amounts[0];

    const balance =
      amounts.length > 1
        ? amounts[amounts.length - 1]
        : undefined;

    const description =
      this.extractDescription(
        normalizedRow,
        dateMatch[1],
      );

    if (description.length < 2) {
      return null;
    }

    const normalizedDescription =
      this.normalizeDescription(
        description,
      );

    return {
      transactionDate,
      description,
      normalizedDescription,
      merchant:
        this.extractMerchant(
          normalizedDescription,
        ),
      referenceId:
        this.extractReferenceId(
          normalizedRow,
        ),
      amount,
      type,
      balance,
      category:
        this.categorize(
          normalizedDescription,
          type,
        ),
    };
  }

  private parseDate(
    value: string,
  ): Date | null {
    const parts =
      value.split(/[/-]/).map(Number);

    if (parts.length !== 3) {
      return null;
    }

    const isYearFirst =
      parts[0] > 1900;

    const year =
      isYearFirst
        ? parts[0]
        : parts[2] < 100
          ? 2000 + parts[2]
          : parts[2];

    const month =
      isYearFirst
        ? parts[1]
        : parts[1];

    const day =
      isYearFirst
        ? parts[2]
        : parts[0];

    const date =
      new Date(
        year,
        month - 1,
        day,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return null;
    }

    return date;
  }

  private parseAmount(
    value: string,
  ): number | null {
    const cleaned =
      value
        .replace(/[₹,\s]/g, "")
        .replace(/[()]/g, "")
        .trim();

    if (
      !/^-?\d+(\.\d{1,2})?$/.test(
        cleaned,
      )
    ) {
      return null;
    }

    const amount =
      Number(cleaned);

    return Number.isFinite(amount)
      ? Math.abs(amount)
      : null;
  }

  private extractDescription(
    row: string,
    dateText: string,
  ): string {
    return row
      .replace(dateText, "")
      .replace(/[₹]?\d[\d,\s]*(\.\d{1,2})?/g, " ")
      .replace(/\b(debit|credit|dr|cr)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private normalizeDescription(
    description: string,
  ): string {
    return description
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, " ")
      .replace(/\b(UPI|POS|IMPS|NEFT|RTGS|ACH|INB|TO|BY)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private extractMerchant(
    normalizedDescription: string,
  ): string {
    return normalizedDescription
      .split(" ")
      .slice(0, 4)
      .join(" ") || "Unknown";
  }

  private extractReferenceId(
    row: string,
  ): string | undefined {
    const match =
      row.match(
        /\b[A-Z0-9]{10,}\b/i,
      );

    return match?.[0];
  }

  private categorize(
    normalizedDescription: string,
    type: BankTransactionType,
  ): FinancialCategory {
    for (const rule of categoryRules) {
      if (
        rule.keywords.some((keyword) =>
          normalizedDescription.includes(
            keyword,
          ),
        )
      ) {
        return rule.category;
      }
    }

    if (
      type ===
      BANK_TRANSACTION_TYPE.CREDIT
    ) {
      return FINANCIAL_CATEGORY.TRANSFER;
    }

    return FINANCIAL_CATEGORY.OTHERS;
  }

  private detectBankName(
    text: string,
  ): string {
    const knownBanks = [
      "HDFC",
      "ICICI",
      "SBI",
      "AXIS",
      "KOTAK",
      "YES BANK",
      "IDFC",
      "INDUSIND",
    ];

    const upperText =
      text.toUpperCase();

    return knownBanks.find((bank) =>
      upperText.includes(bank),
    ) ?? "Unknown Bank";
  }
}
