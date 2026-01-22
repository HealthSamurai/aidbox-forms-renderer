## Element

```json
{
  "id": "QuestionnaireResponse.author",
  "path": "QuestionnaireResponse.author",
  "short": "The individual or device that received and recorded the answers",
  "definition": "The individual or device that received the answers to the questions in the QuestionnaireResponse and recorded them in the system.",
  "comment": "Mapping a subject's answers to multiple choice options and determining what to put in the textual answer is a matter of interpretation. Authoring by device would indicate that some portion of the questionnaire had been auto-populated. Device should only be used if it directly determined the answers, not if it was merely used as a capture tool to record answers provided by others. In the latter case, information about the physical device, software, etc. would be captured using Provenance.",
  "requirements": "Need to know who interpreted the subject's answers to the questions in the questionnaire, and selected the appropriate options for answers.",
  "alias": [
    "Laboratory",
    "Service",
    "Practitioner",
    "Department",
    "Company",
    "Performer"
  ],
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Reference",
      "targetProfile": [
        "http://hl7.org/fhir/StructureDefinition/Device",
        "http://hl7.org/fhir/StructureDefinition/Practitioner",
        "http://hl7.org/fhir/StructureDefinition/PractitionerRole",
        "http://hl7.org/fhir/StructureDefinition/Patient",
        "http://hl7.org/fhir/StructureDefinition/RelatedPerson",
        "http://hl7.org/fhir/StructureDefinition/Organization"
      ]
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Event.performer.actor"
    },
    {
      "identity": "w5",
      "map": "FiveWs.author"
    },
    {
      "identity": "rim",
      "map": ".participation[typeCode=AUT].role"
    }
  ]
}
```
