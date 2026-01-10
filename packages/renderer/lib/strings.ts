export const strings = {
  aria: {
    help: "More information",
    legal: "Legal information",
    flyover: "More context",
  },
  value: {
    yes: "Yes",
    no: "No",
    undefined: "Unanswered",
  },
  dialog: {
    cancel: "Cancel",
    add: "Add",
  },
  errors: {
    unknown: "Unknown error",
  },
  file: {
    sizeLabelKb: "{sizeKb} KB",
  },
  group: {
    addSection: "Add section",
    removeSection: "Remove section",
    noNodesYet: "No nodes yet.",
  },
  grid: {
    emptyNoRowGroups: "No row groups configured for this grid.",
    emptyAllHidden: "All rows are currently hidden.",
    emptyNoQuestions: "Grid rows have no questions to render.",
    rowLabelFallback: "Row",
  },
  gridTable: {
    headerActions: "Actions",
  },
  inputs: {
    referencePlaceholder: "Resource/type/id",
    referenceDisplayPlaceholder: "Display label",
    codingSystemPlaceholder: "System",
    codingCodePlaceholder: "Code",
    codingDisplayPlaceholder: "Display",
    quantityValuePlaceholder: "Value",
    quantityUnitPlaceholder: "Unit",
    attachmentSelected: "Attachment selected",
  },
  selection: {
    specifyOther: "Specify other",
    addAnother: "Add another",
    selectPlaceholder: "Select an option",
    removeSelection: "Remove selection",
    removeCustomValue: "Remove custom value",
  },
  table: {
    noChoiceQuestionsHorizontal:
      "No choice questions available for horizontal table.",
    noChoiceQuestions: "No choice questions available.",
    noAnswerOptionsHorizontal:
      "No answer options available for horizontal table layout.",
    noAnswerOptions: "No answer options available for table layout.",
  },
  tab: {
    empty: "No tab content",
  },
  unsupported: {
    typePrefix: "Unsupported type:",
  },
  validation: {
    group: {
      atLeastOneAnswer: "At least one answer is required in this group.",
    },
    groupList: {
      minOccurs: "At least {minOccurs} occurrence(s) required.",
      maxOccurs: "No more than {maxOccurs} occurrence(s) permitted.",
    },
    question: {
      minOccursSingle: "At least one  non-empty answer is required.",
      minOccursMultiple: "At least {minOccurs} non-empty answers are required.",
      maxOccurs: "No more than {maxOccurs} answers are permitted.",
    },
    answer: {
      minLength: "Response must be at least {minLength} characters long.",
      maxLength: "Response exceeds the maximum length of {maxLength}.",
      minPrecision:
        "Response must be at least {minLength} characters to capture the required precision.",
      maxPrecision: "Response must not exceed {maxLength} characters.",
      blank: "Response must not be blank.",
      valueNotEarlier: "Value must not be earlier than {formatted}.",
      valueNotLater: "Value must not be later than {formatted}.",
      valueMin: "Value must be greater than or equal to {formatted}.",
      valueMax: "Value must be less than or equal to {formatted}.",
      valueDecimalPlaces: "Value must not exceed {maxPlaces} decimal place(s).",
      quantityMin: "Quantity must be greater than or equal to {formatted}.",
      quantityMax: "Quantity must be less than or equal to {formatted}.",
      attachmentTypeRequired:
        "Attachment must declare a content type from the allowed list ({allowed}).",
      attachmentTypeAllowed:
        "Attachment must be one of the allowed content types ({allowed}).",
      attachmentSizeMax: "Attachment must not exceed {maxSize} bytes.",
    },
  },
} as const;
