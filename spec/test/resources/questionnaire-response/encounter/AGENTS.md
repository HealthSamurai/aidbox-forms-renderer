## Element

```json
{
  "id": "QuestionnaireResponse.encounter",
  "path": "QuestionnaireResponse.encounter",
  "short": "Encounter the questionnaire response is part of",
  "definition": "The Encounter during which this questionnaire response was created or to which the creation of this record is tightly associated.",
  "comment": "This will typically be the encounter the questionnaire response was created during, but some questionnaire responses may be initiated prior to or after the official completion of an encounter but still be tied to the context of the encounter (e.g. pre-admission forms).  A questionnaire that was initiated during an encounter but not fully completed during the encounter would still generally be associated with the encounter.",
  "requirements": "Links the questionnaire response to the Encounter context.  May also affect access control.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Reference",
      "targetProfile": ["http://hl7.org/fhir/StructureDefinition/Encounter"]
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Event.encounter"
    },
    {
      "identity": "w5",
      "map": "FiveWs.context"
    },
    {
      "identity": "rim",
      "map": ".inboundRelationship(typeCode=COMP].source[classCode<=PCPR, moodCode=EVN]"
    }
  ]
}
```
