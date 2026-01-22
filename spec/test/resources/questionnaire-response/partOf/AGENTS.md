## Element

```json
{
  "id": "QuestionnaireResponse.partOf",
  "path": "QuestionnaireResponse.partOf",
  "short": "Part of referenced event",
  "definition": "A procedure or observation that this questionnaire was performed as part of the execution of.  For example, the surgery a checklist was executed as part of.",
  "comment": "Not to be used to link an questionnaire response to an Encounter - use 'context' for that.\n\nComposition of questionnaire responses will be handled using the Assemble operation defined in the SDC IG.  For relationships to referrals, and other types of requests, use basedOn.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "Reference",
      "targetProfile": [
        "http://hl7.org/fhir/StructureDefinition/Observation",
        "http://hl7.org/fhir/StructureDefinition/Procedure"
      ]
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Event.partOf"
    },
    {
      "identity": "rim",
      "map": ".inboundRelationship[typeCode=COMP].source[moodCode=EVN]"
    }
  ]
}
```
