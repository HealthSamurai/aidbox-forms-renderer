## Element

```json
{
  "id": "QuestionnaireResponse.status",
  "path": "QuestionnaireResponse.status",
  "short": "in-progress | completed | amended | entered-in-error | stopped",
  "definition": "The current state of the questionnaire response.",
  "comment": "Unknown does not represent \"other\" - one of the defined statuses must apply.  Unknown is used when the authoring system is not sure what the current status is.",
  "requirements": "The information on Questionnaire resources  may possibly be gathered during multiple sessions and altered after considered being finished.",
  "min": 1,
  "max": "1",
  "type": [
    {
      "code": "code"
    }
  ],
  "mustSupport": false,
  "isModifier": true,
  "isModifierReason": "This element is labelled as a modifier because it is a status element that contains status entered-in-error which means that the resource should not be treated as valid",
  "isSummary": true,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "QuestionnaireResponseStatus"
      }
    ],
    "strength": "required",
    "description": "Lifecycle status of the questionnaire response.",
    "valueSet": "http://hl7.org/fhir/ValueSet/questionnaire-answers-status|5.0.0"
  },
  "mapping": [
    {
      "identity": "workflow",
      "map": "Event.status"
    },
    {
      "identity": "w5",
      "map": "FiveWs.status"
    },
    {
      "identity": "rim",
      "map": ".statusCode (also whether there's a revisionControlAct - and possibly mood to distinguish \"in-progress\" from \"published)"
    }
  ]
}
```
