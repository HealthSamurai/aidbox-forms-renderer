## Element

```json
{
  "id": "Questionnaire.effectivePeriod",
  "path": "Questionnaire.effectivePeriod",
  "short": "When the questionnaire is expected to be used",
  "definition": "The period during which the questionnaire content was or is planned to be in active use.",
  "comment": "The effective period for a questionnaire  determines when the content is applicable for usage and is independent of publication and review dates. For example, a questionnaire intended to be used for the year 2016 might be published in 2015.\n\nSee guidance around (not) making local changes to elements [here](canonicalresource.html#localization).",
  "requirements": "Allows establishing a transition before a resource comes into effect and also allows for a sunsetting  process when new versions of the questionnaire are or are expected to be used instead.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Period"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.effectivePeriod"
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
