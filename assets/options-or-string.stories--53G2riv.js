import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"attachment-wc-lookup-non-repeating-options-or-string",text:"Upload an attachment",type:"attachment",repeats:!1,control:"lookup",answerConstraint:"optionsOrString",answerOption:c("attachment",[{url:"https://example.com/file.pdf",title:"Consent Form"},{url:"https://example.com/file2.pdf",title:"Information Sheet"}])}),t=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/attachment/with item-control/lookup/non-repeating/with answer-options",component:o,parameters:i,argTypes:s},e={name:"options or string",args:{questionnaireSource:t},render:r=>a.jsx(o,{scenario:{name:"attachment-wc-lookup-non-repeating-options-or-string",title:"options or string",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-lookup-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const h=["OptionsOrString"];export{e as OptionsOrString,h as __namedExportsOrder,f as default};
