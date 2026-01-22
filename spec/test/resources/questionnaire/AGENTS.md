## Element

```json
{
  "id": "Questionnaire",
  "path": "Questionnaire",
  "short": "A structured set of questions",
  "definition": "A structured set of questions intended to guide the collection of answers from end-users. Questionnaires provide detailed control over order, presentation, phraseology and grouping to allow coherent, consistent data collection.",
  "alias": ["Form", "CRF", "Survey"],
  "min": 0,
  "max": "*",
  "constraint": [
    {
      "key": "cnl-0",
      "severity": "warning",
      "human": "Name should be usable as an identifier for the module by machine processing applications such as code generation",
      "expression": "name.exists() implies name.matches('^[A-Z]([A-Za-z0-9_]){1,254}$')",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    },
    {
      "key": "que-2",
      "severity": "error",
      "human": "The link ids for groups and questions must be unique within the questionnaire",
      "expression": "descendants().linkId.isDistinct()",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition"
    },
    {
      "identity": "w5",
      "map": "infrastructure.information"
    },
    {
      "identity": "rim",
      "map": "Observation[moodCode=DEF]"
    }
  ]
}
```
