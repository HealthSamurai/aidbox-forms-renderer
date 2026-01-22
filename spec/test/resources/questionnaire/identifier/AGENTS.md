## Element

```json
{
  "id": "Questionnaire.identifier",
  "path": "Questionnaire.identifier",
  "short": "Business identifier for questionnaire",
  "definition": "A formal identifier that is used to identify this questionnaire when it is represented in other formats, or referenced in a specification, model, design or an instance.",
  "comment": "Typically, this is used for identifiers that can go in an HL7 V3 II (instance identifier) data type, and can then identify this questionnaire outside of FHIR, where it is not possible to use the logical URI.",
  "requirements": "Allows externally provided and/or usable business identifiers to be easily associated with the questionnaire.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "Identifier"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.identifier"
    },
    {
      "identity": "w5",
      "map": "FiveWs.identifier"
    },
    {
      "identity": "rim",
      "map": ".identifier"
    },
    {
      "identity": "objimpl",
      "map": "no-gen-base"
    }
  ]
}
```
