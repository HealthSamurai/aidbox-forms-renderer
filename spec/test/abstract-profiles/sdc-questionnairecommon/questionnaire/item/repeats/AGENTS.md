## Element

```json
{
  "id": "Questionnaire.item.repeats",
  "path": "Questionnaire.item.repeats",
  "definition": "An indication, if true, that a QuestionnaireResponse for this item may include multiple answers associated with a single instance of this item (for question-type items) or multiple repetitions of the item (for group-type items)",
  "mustSupport": true,
  "mapping": [{ "identity": "ihe-sdc", "map": "./cardinality/maximum!=1" }]
}
```
