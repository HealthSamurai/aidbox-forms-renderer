## Element

```json
{
  "id": "QuestionnaireResponse.source",
  "path": "QuestionnaireResponse.source",
  "short": "The individual or device that answered the questions",
  "definition": "The individual or device that answered the questions about the subject.",
  "comment": "If not specified, no inference can be made about who provided the data. Device should only be used if it directly determined the answers, not if it was merely used as a capture tool to record answers provided by others. In the latter case, information about the physical device, software, etc. would be captured using Provenance.",
  "requirements": "When answering questions about a subject that is minor, incapable of answering or an animal, another human source may answer the questions.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Reference",
      "targetProfile": [
        "http://hl7.org/fhir/StructureDefinition/Device",
        "http://hl7.org/fhir/StructureDefinition/Organization",
        "http://hl7.org/fhir/StructureDefinition/Patient",
        "http://hl7.org/fhir/StructureDefinition/Practitioner",
        "http://hl7.org/fhir/StructureDefinition/PractitionerRole",
        "http://hl7.org/fhir/StructureDefinition/RelatedPerson"
      ]
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "w5",
      "map": "FiveWs.source"
    },
    {
      "identity": "rim",
      "map": ".participation[typeCode=INF].role"
    }
  ]
}
```
