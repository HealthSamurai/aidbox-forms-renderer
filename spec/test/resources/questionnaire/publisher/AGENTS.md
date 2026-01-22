## Element

```json
{
  "id": "Questionnaire.publisher",
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
  "path": "Questionnaire.publisher",
  "short": "Name of the publisher/steward (organization or individual)",
  "definition": "The name of the organization or individual responsible for the release and ongoing maintenance of the questionnaire.",
  "comment": "Usually an organization but may be an individual. The publisher (or steward) of the questionnaire is the organization or individual primarily responsible for the maintenance and upkeep of the questionnaire. This is not necessarily the same individual or organization that developed and initially authored the content. The publisher is the primary point of contact for questions or issues with the questionnaire. This item SHOULD be populated unless the information is available from context.",
  "requirements": "Helps establish the \"authority/credibility\" of the questionnaire.  May also allow for contact.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "string"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.publisher"
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
