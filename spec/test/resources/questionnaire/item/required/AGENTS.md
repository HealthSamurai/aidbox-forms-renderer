## Element

```json
{
  "id": "Questionnaire.item.required",
  "path": "Questionnaire.item.required",
  "short": "Whether the item must be included in data results",
  "definition": "An indication, if true, that the item must be present in a \"completed\" QuestionnaireResponse.  If false, the item may be skipped when answering the questionnaire.",
  "comment": "If the required item is a question, it must have a direct answer (i.e. an answer to the question itself, not merely answers to child questions) in order for the QuestionnaireResponse to be complete.  If the required item is a group, it must have at least one descendant question which has an answer  Questionnaire.item.required only has meaning for elements that are conditionally enabled with enableWhen if the condition evaluates to true.  It also only has meaning if the parent element is present.  If a non-required 'group' item contains a 'required' question item, it's completely fine to omit the group (because it's not required) despite it having a required child.  Similarly, if an item that contains other items is marked as required, that does not automatically make the contained elements required (though required groups must contain at least one descendant item with a populated answer). The value for 'required' may come from the ElementDefinition referred to by .definition.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "boolean"
    }
  ],
  "meaningWhenMissing": "Items are assumed not to be required unless explicitly specified, though extensions may impose additional expectations",
  "condition": ["que-6"],
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
