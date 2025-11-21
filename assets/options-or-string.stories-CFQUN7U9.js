import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"attachment-wc-text-box-repeating-options-or-string",text:"Upload an attachment",type:"attachment",repeats:!0,control:"text-box",answerConstraint:"optionsOrString",answerOption:c("attachment",[{url:"https://example.com/file.pdf",title:"Consent Form"},{url:"https://example.com/file2.pdf",title:"Information Sheet"}])}),e=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/attachment/with item-control/text-box/repeating/with answer-options",component:o,parameters:i,argTypes:s},t={name:"options or string",args:{questionnaireSource:e},render:n=>a.jsx(o,{scenario:{name:"attachment-wc-text-box-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:e})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-text-box-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...t.parameters?.docs?.source}}};const f=["OptionsOrString"];export{t as OptionsOrString,f as __namedExportsOrder,S as default};
