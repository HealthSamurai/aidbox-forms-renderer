import{j as r}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=c({linkId:"attachment-wc-check-box-non-repeating-options-only",text:"Upload an attachment",type:"attachment",repeats:!1,control:"check-box",answerConstraint:"optionsOnly",answerOption:p("attachment",[{url:"https://example.com/file.pdf",title:"Consent Form"},{url:"https://example.com/file2.pdf",title:"Information Sheet"}])}),t=JSON.stringify(o.form.questionnaire,null,2),S={title:"Question/attachment/with item-control/check-box/non-repeating/with answer-options",component:n,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:t},render:a=>r.jsx(n,{scenario:{name:"attachment-wc-check-box-non-repeating-options-only",title:"options only",build:()=>o},questionnaireSource:a.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-check-box-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const y=["OptionsOnly"];export{e as OptionsOnly,y as __namedExportsOrder,S as default};
