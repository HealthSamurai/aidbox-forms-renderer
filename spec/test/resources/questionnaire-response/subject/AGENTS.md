## Element

```json
{
  "id": "QuestionnaireResponse.subject",
  "path": "QuestionnaireResponse.subject",
  "short": "The subject of the questions",
  "definition": "The subject of the questionnaire response.  This could be a patient, organization, practitioner, device, etc.  This is who/what the answers apply to, but is not necessarily the source of information.",
  "comment": "If the Questionnaire declared a subjectType, the resource pointed to by this element must be an instance of one of the listed types.",
  "requirements": "Links the questionnaire response to the Patient context.  May also affect access control.",
  "alias": ["Patient", "Focus"],
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Reference",
      "targetProfile": ["http://hl7.org/fhir/StructureDefinition/Resource"]
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Event.subject"
    },
    {
      "identity": "w5",
      "map": "FiveWs.subject[x]"
    },
    {
      "identity": "rim",
      "map": ".participation[typeCode=SBJ].role"
    }
  ]
}
```
