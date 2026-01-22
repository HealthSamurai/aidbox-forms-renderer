## Element

```json
{
  "id": "QuestionnaireResponse.questionnaire",
  "path": "QuestionnaireResponse.questionnaire",
  "short": "Canonical URL of Questionnaire being answered",
  "definition": "The Questionnaire that defines and organizes the questions for which answers are being provided.",
  "comment": "If a QuestionnaireResponse references a Questionnaire that can be resolved, then the QuestionnaireResponse structure must be consistent with the Questionnaire (i.e. questions must be organized into the same groups, nested questions must still be nested, etc.).  It is possible to have a QuestionnaireResponse whose 'questionnaire' element does not resolve.  It is also possible for the questionnaire element to not have a value but only extensions (e.g. conveying the title or identifier for the questionnaire).  This may happen for legacy data.  If there is no formally defined Questionnaire, it is undefined what the 'correct' values for the linkId elements should be and it is possible that linkIds might be inconsistent for QuestionnaireResponses for the same form if captured by distinct systems.",
  "requirements": "Needed to allow editing of the questionnaire response in a manner that enforces the constraints of the original form.",
  "alias": ["Form"],
  "min": 1,
  "max": "1",
  "type": [
    {
      "code": "canonical",
      "targetProfile": ["http://hl7.org/fhir/StructureDefinition/Questionnaire"]
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "rim",
      "map": "./outboundRelationship[typeCode=INST]/target[classCode=OBS, moodCode=DEFN]"
    }
  ]
}
```
