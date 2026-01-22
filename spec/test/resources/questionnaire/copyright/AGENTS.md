## Element

```json
{
  "id": "Questionnaire.copyright",
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
  "path": "Questionnaire.copyright",
  "short": "Use and/or publishing restrictions",
  "definition": "A copyright statement relating to the questionnaire and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the questionnaire.",
  "requirements": "Consumers of the questionnaire must be able to determine any legal restrictions on the use of the artifact and/or its content.",
  "alias": ["License", "Restrictions"],
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "markdown"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.copyright"
    },
    {
      "identity": "rim",
      "map": "N/A (to add?)"
    },
    {
      "identity": "objimpl",
      "map": "no-gen-base"
    }
  ]
}
```
