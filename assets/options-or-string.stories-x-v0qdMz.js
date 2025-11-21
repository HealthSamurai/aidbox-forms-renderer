import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as o,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"text-wc-radio-button-repeating-options-or-string",text:"Enter long text",type:"text",repeats:!0,control:"radio-button",answerConstraint:"optionsOrString",answerOption:p("text",["Note A","Note B","Note C"])}),e=JSON.stringify(r.form.questionnaire,null,2),x={title:"Question/text/with item-control/radio-button/repeating/with answer-options",component:o,parameters:a,argTypes:i},t={name:"options or string",args:{questionnaireSource:e},render:n=>s.jsx(o,{scenario:{name:"text-wc-radio-button-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:e})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "text-wc-radio-button-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...t.parameters?.docs?.source}}};const f=["OptionsOrString"];export{t as OptionsOrString,f as __namedExportsOrder,x as default};
