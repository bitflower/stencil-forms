import { Component, h, Host, State } from '@stencil/core';
import { control, labelFor, descriptionFor, validationFor, validationMessage, submitValidity } from '../../index';

const myData: any = {
  name: 'Danny',
  email: 'danny@gmail.com',
  address: 'Some Street 23',
};

const myControls: any[] = [
  {
    name: 'name',
  },
  {
    name: 'email',
  },
  {
    name: 'address',
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
    this.json = JSON.stringify(this.data, null, 2);
  }

  onSubmit = (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();

    this.buildFormData();
    console.info('submit', this.json);
  };

  render() {
    return (
      <Host>
        <form onInput={this.onSubmit} ref={(el) => (this.formEl = el)}>
          {myControls.map((ctl) => {
            const initialValue = this.data[ctl.name];
            const binding = control(initialValue, {});
            return (
              <section>
                <div>
                  <label {...labelFor(binding)}>{ctl.name}</label>
                </div>
                <div {...descriptionFor(binding)}>
                  What's your {ctl.name}? {this.data[ctl.name]}
                </div>
                <div>
                  <input
                    name={ctl.name}
                    required
                    {...binding()}
                    {...(ctl.name === 'email' && { type: 'email' })}
                    value={this.data[ctl.name]}
                  />
                </div>
                <span {...validationFor(binding)}>{validationMessage(binding)}</span>
              </section>
            );
          })}
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
