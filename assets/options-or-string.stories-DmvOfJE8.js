import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"attachment-wc-slider-non-repeating-options-or-string",text:"Upload an attachment",type:"attachment",repeats:!1,control:"slider",answerConstraint:"optionsOrString",answerOption:c("attachment",[{url:"https://example.com/file.pdf",title:"Consent Form"},{url:"https://example.com/file2.pdf",title:"Information Sheet"}])}),t=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/attachment/with item-control/slider/non-repeating/with answer-options",component:n,parameters:i,argTypes:s},e={name:"options or string",args:{questionnaireSource:t},render:o=>a.jsx(n,{scenario:{name:"attachment-wc-slider-non-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:o.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-slider-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const h=["OptionsOrString"];export{e as OptionsOrString,h as __namedExportsOrder,f as default};
