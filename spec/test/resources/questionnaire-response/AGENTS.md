## Element

```json
{
  "id": "QuestionnaireResponse",
  "path": "QuestionnaireResponse",
  "short": "A structured set of questions and their answers",
  "definition": "A structured set of questions and their answers. The questions are ordered and grouped into coherent subsets, corresponding to the structure of the grouping of the questionnaire being responded to.",
  "comment": "The QuestionnaireResponse contains enough information about the questions asked and their organization that it can be interpreted somewhat independently from the Questionnaire it is based on.  I.e. You don't need access to the Questionnaire in order to extract basic information from a QuestionnaireResponse.",
  "alias": ["Form", "QuestionnaireAnswers"],
  "min": 0,
  "max": "*",
  "mustSupport": false,
  "isModifier": false,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Event"
    },
    {
      "identity": "w5",
      "map": "infrastructure.information"
    },
    {
      "identity": "rim",
      "map": "Observation[moodCode=EVN]"
    }
  ]
}
```
