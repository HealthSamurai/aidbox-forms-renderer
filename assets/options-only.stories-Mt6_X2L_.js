import{j as r}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as p,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"attachment-wc-lookup-non-repeating-options-only",text:"Upload an attachment",type:"attachment",repeats:!1,control:"lookup",answerConstraint:"optionsOnly",answerOption:l("attachment",[{url:"https://example.com/file.pdf",title:"Consent Form"},{url:"https://example.com/file2.pdf",title:"Information Sheet"}])}),o=JSON.stringify(n.form.questionnaire,null,2),h={title:"Question/attachment/with item-control/lookup/non-repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:a=>r.jsx(t,{scenario:{name:"attachment-wc-lookup-non-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:a.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-lookup-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const y=["OptionsOnly"];export{e as OptionsOnly,y as __namedExportsOrder,h as default};
