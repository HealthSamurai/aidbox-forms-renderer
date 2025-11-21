import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"text-wc-lookup-non-repeating-options-or-string",text:"Enter long text",type:"text",repeats:!1,control:"lookup",answerConstraint:"optionsOrString",answerOption:u("text",["Note A","Note B","Note C"])}),o=JSON.stringify(r.form.questionnaire,null,2),x={title:"Question/text/with item-control/lookup/non-repeating/with answer-options",component:t,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:o},render:n=>s.jsx(t,{scenario:{name:"text-wc-lookup-non-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "text-wc-lookup-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,x as default};
