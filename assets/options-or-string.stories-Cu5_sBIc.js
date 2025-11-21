import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=c({linkId:"attachment-wc-check-box-repeating-options-or-string",text:"Upload an attachment",type:"attachment",repeats:!0,control:"check-box",answerConstraint:"optionsOrString",answerOption:p("attachment",[{url:"https://example.com/file.pdf",title:"Consent Form"},{url:"https://example.com/file2.pdf",title:"Information Sheet"}])}),t=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/attachment/with item-control/check-box/repeating/with answer-options",component:o,parameters:i,argTypes:s},e={name:"options or string",args:{questionnaireSource:t},render:n=>a.jsx(o,{scenario:{name:"attachment-wc-check-box-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-check-box-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,S as default};
