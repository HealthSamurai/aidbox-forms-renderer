## Element

```json
{
  "id": "Questionnaire.description",
  "extension": [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-translatable",
      "valueBoolean": true
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-translatable",
      "valueBoolean": true
    }
  ],
  "path": "Questionnaire.description",
  "short": "Natural language description of the questionnaire",
  "definition": "A free text natural language description of the questionnaire from a consumer's perspective.",
  "comment": "This description can be used to capture details such as comments about misuse, instructions for clinical use and interpretation, literature references, examples from the paper world, etc. It is not a rendering of the questionnaire as conveyed in the 'text' field of the resource itself. This item SHOULD be populated unless the information is available from context. (E.g. the language of the questionnaire is presumed to be the predominant language in the place the questionnaire was created).",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "markdown"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.description"
    },
    {
      "identity": "rim",
      "map": ".text"
    }
  ]
}
```
