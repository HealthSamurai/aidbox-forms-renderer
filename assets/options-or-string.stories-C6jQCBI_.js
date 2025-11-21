import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as o,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=c({linkId:"text-wc-check-box-repeating-options-or-string",text:"Enter long text",type:"text",repeats:!0,control:"check-box",answerConstraint:"optionsOrString",answerOption:p("text",["Note A","Note B","Note C"])}),t=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/text/with item-control/check-box/repeating/with answer-options",component:o,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:t},render:n=>s.jsx(o,{scenario:{name:"text-wc-check-box-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "text-wc-check-box-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,S as default};
