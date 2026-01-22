## Element

```json
{
  "id": "Questionnaire.version",
  "path": "Questionnaire.version",
  "short": "Business version of the questionnaire",
  "definition": "The identifier that is used to identify this version of the questionnaire when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the questionnaire author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence.",
  "comment": "There may be different questionnaires that have the same url but different versions.  The version can be appended to the url in a reference to allow a reference to a particular business version of the questionnaire with the format. The version SHOULD NOT contain a '#' - see [Business Version](resource.html#bv-format).",
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
      "map": "Definition.version"
    },
    {
      "identity": "w5",
      "map": "FiveWs.version"
    },
    {
      "identity": "rim",
      "map": "N/A (to add?)"
    }
  ]
}
```
