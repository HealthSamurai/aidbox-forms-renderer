import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"attachment-wc-text-box-non-repeating-options-or-string",text:"Upload an attachment",type:"attachment",repeats:!1,control:"text-box",answerConstraint:"optionsOrString",answerOption:c("attachment",[{url:"https://example.com/file.pdf",title:"Consent Form"},{url:"https://example.com/file2.pdf",title:"Information Sheet"}])}),e=JSON.stringify(o.form.questionnaire,null,2),S={title:"Question/attachment/with item-control/text-box/non-repeating/with answer-options",component:n,parameters:i,argTypes:s},t={name:"options or string",args:{questionnaireSource:e},render:r=>a.jsx(n,{scenario:{name:"attachment-wc-text-box-non-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:r.questionnaireSource,defaultSource:e})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-text-box-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...t.parameters?.docs?.source}}};const f=["OptionsOrString"];export{t as OptionsOrString,f as __namedExportsOrder,S as default};
