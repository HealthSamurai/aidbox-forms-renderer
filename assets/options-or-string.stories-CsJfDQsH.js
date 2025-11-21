import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as n,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"text-wc-spinner-non-repeating-options-or-string",text:"Enter long text",type:"text",repeats:!1,control:"spinner",answerConstraint:"optionsOrString",answerOption:u("text",["Note A","Note B","Note C"])}),t=JSON.stringify(r.form.questionnaire,null,2),x={title:"Question/text/with item-control/spinner/non-repeating/with answer-options",component:n,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:t},render:o=>s.jsx(n,{scenario:{name:"text-wc-spinner-non-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:o.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "text-wc-spinner-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,x as default};
