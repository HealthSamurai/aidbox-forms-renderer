import{j as a}from"./index-BsWNCus6.js";import{b as i,a as s,N as n,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"attachment-wc-radio-button-non-repeating-options-or-string",text:"Upload an attachment",type:"attachment",repeats:!1,control:"radio-button",answerConstraint:"optionsOrString",answerOption:c("attachment",[{url:"https://example.com/file.pdf",title:"Consent Form"},{url:"https://example.com/file2.pdf",title:"Information Sheet"}])}),e=JSON.stringify(o.form.questionnaire,null,2),f={title:"Question/attachment/with item-control/radio-button/non-repeating/with answer-options",component:n,parameters:s,argTypes:i},t={name:"options or string",args:{questionnaireSource:e},render:r=>a.jsx(n,{scenario:{name:"attachment-wc-radio-button-non-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:r.questionnaireSource,defaultSource:e})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-radio-button-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...t.parameters?.docs?.source}}};const h=["OptionsOrString"];export{t as OptionsOrString,h as __namedExportsOrder,f as default};
