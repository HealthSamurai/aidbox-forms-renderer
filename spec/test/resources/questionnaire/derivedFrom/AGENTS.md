## Element

```json
{
  "id": "Questionnaire.derivedFrom",
  "path": "Questionnaire.derivedFrom",
  "short": "Based on Questionnaire",
  "definition": "The URL of a Questionnaire that this Questionnaire is based on.",
  "comment": "This element covers a broad range of relationships, from 'somewhat inspired by' to 'fully compliant with'.         There is a standard extensionthat allows clearer differentiation between the specifics of the derivation relationship where          this is needed - e.g. to determine substitutability and validation expectations -          [http://hl7.org/fhir/StructureDefinition/questionnaire-derivationType](http://hl7.org/fhir/extensions/StructureDefinition-questionnaire-derivationType.html).",
  "requirements": "Allows a Questionnaire to be created based on another Questionnaire.",
  "min": 0,
  "max": "*",
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
      "identity": "workflow",
      "map": "Definition.derivedFromCanonical"
    },
    {
      "identity": "rim",
      "map": ".outboundRelationship[typeCode=DRIV].target[classCode=OBS, moodCode=DEFN]"
    }
  ]
}
```
