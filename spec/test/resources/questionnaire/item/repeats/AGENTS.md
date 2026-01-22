## Element

```json
{
  "id": "Questionnaire.item.repeats",
  "path": "Questionnaire.item.repeats",
  "short": "Whether the item may repeat",
  "definition": "An indication, if true, that a QuestionnaireResponse for this item may include multiple answers associated with a single instance of this item (for question-type items) or multiple repetitions of the item (for group-type items).",
  "comment": "If a question is marked as repeats=true, then multiple answers can be provided for the question in the corresponding QuestionnaireResponse.  When rendering the questionnaire, it is up to the rendering software whether to render the question text for each answer repetition (i.e. \"repeat the question\") or to simply allow entry/selection of multiple answers for the question (repeat the answers).  Which is most appropriate visually may depend on the type of answer as well as whether there are nested items.\n\nThe resulting QuestionnaireResponse will be populated the same way regardless of rendering - one 'question' item with multiple answer values.\n\n The value may come from the ElementDefinition referred to by .definition.  When repeats=true for a group, it'll be represented with multiple items with the same linkId in the QuestionnaireResponse.  For a question, it'll be represented by a single item with that linkId with multiple answers.",
  "requirements": "Items may be used to create set of (related) questions that can be repeated to give multiple answers to such a set.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "boolean"
    }
  ],
  "meaningWhenMissing": "Items are generally assumed not to repeat unless explicitly specified. Systems SHOULD always populate this value",
  "condition": ["que-6", "que-13"],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": "N/A - MIF rather than RIM level"
    }
  ]
}
```
