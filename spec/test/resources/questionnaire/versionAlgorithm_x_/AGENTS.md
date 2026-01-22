## Element

```json
{
  "id": "Questionnaire.versionAlgorithm[x]",
  "path": "Questionnaire.versionAlgorithm[x]",
  "short": "How to compare versions",
  "definition": "Indicates the mechanism used to compare versions to determine which is more current.",
  "comment": "If set as a string, this is a FHIRPath expression that has two additional context variables passed in - %version1 and %version2 and will return a negative number if version1 is newer, a positive number if version2 and a 0 if the version ordering can't be successfully be determined.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "string"
    },
    {
      "code": "Coding"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "binding": {
    "strength": "extensible",
    "valueSet": "http://hl7.org/fhir/ValueSet/version-algorithm"
  },
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.versionAlgorithm"
    }
  ]
}
```
