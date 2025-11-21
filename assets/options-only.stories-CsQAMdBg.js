import{j as r}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as p,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"attachment-wc-radio-button-repeating-options-only",text:"Upload an attachment",type:"attachment",repeats:!0,control:"radio-button",answerConstraint:"optionsOnly",answerOption:l("attachment",[{url:"https://example.com/file.pdf",title:"Consent Form"},{url:"https://example.com/file2.pdf",title:"Information Sheet"}])}),e=JSON.stringify(n.form.questionnaire,null,2),h={title:"Question/attachment/with item-control/radio-button/repeating/with answer-options",component:o,parameters:i,argTypes:s},t={name:"options only",args:{questionnaireSource:e},render:a=>r.jsx(o,{scenario:{name:"attachment-wc-radio-button-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:a.questionnaireSource,defaultSource:e})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-radio-button-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...t.parameters?.docs?.source}}};const y=["OptionsOnly"];export{t as OptionsOnly,y as __namedExportsOrder,h as default};
