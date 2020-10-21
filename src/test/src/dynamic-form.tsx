import { Component, h, Host, State } from '@stencil/core';
import { control, labelFor, descriptionFor, validationFor, validationMessage, submitValidity } from '../../index';
import { ReactiveFormEvent, ReactiveFormControl } from '../../types';

const myData: any = {
  name: 'Danny',
  email: 'danny@gmail.com',
  address: 'Some Street 23',
};

const myControls: any[] = [
  {
    name: 'name',
    type: 'text',
  },
  {
    name: 'email',
    type: 'email',
  },
  {
    name: 'address',
    type: 'text',
  },
];

@Component({
  tag: 'dynamic-form',
  styleUrl: 'dynamic-form.css',
})
export class DynamicForm {
  protected formEl: HTMLFormElement;

  @State() data = myData;
  @State() json = '';

  //   componentWillLoad() {
  //   }

  private buildFormData() {
    // if (!this.formEl.checkValidity()) {
    //   return;
    // }
    const formData = new FormData(this.formEl);
    this.data = Object.fromEntries(formData as any);
    console.log(`buildFormData`, { 'this.data': this.data });
    this.json = JSON.stringify(this.data, null, 2);
  }

  onSubmit = (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();

    this.buildFormData();
    console.info('submit', this.json);
  };

  onValueChange(name: string, e: ReactiveFormEvent) {
    console.log('onValueChange', name, e);
  }

  render() {
    const dynamicControls: { ctl: any; binding: ReactiveFormControl }[] = myControls.map((ctl) => ({
      ctl,
      binding: control(this.data[ctl.name], {
        onValueChange: ({ value }) => {
          console.log(`${ctl.name} change: ${value}`);
          this.data = {
            ...this.data,
            [ctl.name]: value,
          };
        },
        onCommit({ value }) {
          console.log(`${ctl.name} commit: ${value}`);
        },
      }),
    }));

    return (
      <Host>
        <form onInput={this.onSubmit} ref={(el) => (this.formEl = el)}>
          {dynamicControls.map((ctl) => (
            <section>
              <div>
                <label {...labelFor(ctl.binding)}>MyData</label>
              </div>
              <div {...descriptionFor(ctl.binding)}>
                data.{ctl.ctl.name}: {this.data[ctl.ctl.name]}
              </div>
              <div>
                <input name={ctl.ctl.name} type={ctl.ctl.type} required {...ctl.binding()} />
              </div>
              <div {...validationFor(ctl.binding)}>{validationMessage(ctl.binding)}</div>
            </section>
          ))}
          {/* {myControls.map((ctl) => {
            const initialValue = this.data[ctl.name];
            const { name } = ctl;
            console.log(`Control`, { 'this.data': this.data, ctl, name, initialValue });
            const binding = control(initialValue, {
              propName: name,
              // debounce: 500,
              // validate: (e: ReactiveFormEvent) => {
              //   console.log('validate', e);
              //   return '';
              // },
              onValueChange: (e) => this.onValueChange(name, e),
            });
            return (
              <section>
                <div>
                  <label {...labelFor(binding)}>{name}</label>
                </div>
                <div {...descriptionFor(binding)}>
                  What's your {name}? {this.data[name]}
                </div>
                <div>
                  <input
                    name={name}
                    required
                    {...binding()}
                    {...(name === 'email' && { type: 'email' })}
                    // value={initialValue}
                  />
                </div>
                <span {...validationFor(binding)}>{validationMessage(binding)}</span>
              </section>
            );
          })} */}
          <section>
            <button type="submit" {...submitValidity('')}>
              Submit
            </button>
          </section>
        </form>
        {this.json !== '' ? <pre>Form Submit {this.json}</pre> : null}
      </Host>
    );
  }
}
