## Element

```json
{
  "id": "Questionnaire.lastReviewDate",
  "path": "Questionnaire.lastReviewDate",
  "short": "When the questionnaire was last reviewed by the publisher",
  "definition": "The date on which the resource content was last reviewed. Review happens periodically after approval but does not change the original approval date.",
  "comment": "If specified, this date follows the original approval date.\n\nSee guidance around (not) making local changes to elements [here](canonicalresource.html#localization).",
  "requirements": "Gives a sense of how \"current\" the content is.  Resources that have not been reviewed in a long time may have a risk of being less appropriate/relevant.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "date"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.lastReviewDate"
    },
    {
      "identity": "rim",
      "map": ".outboundRelationship[typeCode=\"SUBJ\"; subsetCode=\"RECENT\"].act[classCode=CACT;moodCode=EVN;code=\"review\"].effectiveTime"
    },
    {
      "identity": "objimpl",
      "map": "no-gen-base"
    }
  ]
}
```
