import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AbstractControl,
  Form,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { defer, interval, Subject } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';

export enum FieldType {
  Number = 'number',
  Text = 'text',
}

export interface FieldBase {
  name: string;
}

export interface TextField extends FieldBase {
  type: FieldType.Text;
  placeholder?: string;
  width?: string;
}

export interface NumberField extends FieldBase {
  type: FieldType.Number;
}

export interface GroupField {
  [key: string]: GroupField | TextField;
}

export type Field = GroupField | TextField | NumberField;
export type ModelDefinition = Array<Field>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-number-field',
  template: `
    <input type="number" [formControl]="control" />
    <!--    {{ now$ | async }}-->
  `,
})
export class NumberFieldComponent {
  @Input() control: FormControl;
  @Input() field: NumberField;
  // now$ = interval(1000).pipe(map(() => new Date()));

  ngDoCheck() {
    // console.count('Check <number-field>');
  }

  noop() {}
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-text-field',
  template: `
    <input
      type="text"
      [formControl]="control"
      [placeholder]="field.placeholder"
    />
  `,
})
export class TextFieldComponent {
  @Input() control: FormControl;
  @Input() field: TextField;

  ngDoCheck() {
    // console.count('Check <text-field>');
  }

  noop() {}
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-dynamic-field',
  template: `
    <ng-container [ngSwitch]="field.type">
      <mc-number-field
        *ngSwitchCase="FieldType.Number"
        [control]="control"
        [field]="field"
      ></mc-number-field>
      <mc-text-field
        *ngSwitchCase="FieldType.Text"
        [control]="control"
        [field]="field"
      ></mc-text-field>
    </ng-container>
  `,
})
export class DynamicFieldComponent {
  FieldType = FieldType;

  @Input() control: AbstractControl;
  @Input() field: Field;
}

function diff(initialValue, value) {
  return {
    title: value.title,
  };
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-dynamic-form',
  template: `
    <mc-dynamic-field
      *ngFor="let field of definition"
      [control]="form.get(field.name)"
      [field]="field"
      (change)="someInputChange()"
    ></mc-dynamic-field>

    <ng-container [formGroup]="form.get('address')">
      <input placeholder="street" formControlName="street" type="text" />
    </ng-container>
  `
})
export class DynamicFormComponent {
  @Input() definition: ModelDefinition;

  form = new FormGroup({
    title: new FormControl(),
    test: new FormControl(),
    price: new FormControl(),
    address: new FormGroup({
      street: new FormControl('Rue Bidule'),
    }),
    entries: new FormArray([new FormGroup({})]),
  });

  change$ = new Subject<void>();

  ngDoCheck() {
    // console.count('Check <dynamic-form>');
  }

  ngOnInit() {
    const initialValue = { title: 'test' };
    this.form.patchValue(initialValue);
    let initialFormValue = this.form.value;
    setTimeout(() => (initialFormValue = this.form.value));

    // this.form.get('title').valueChanges.subscribe(console.log);
    // this logic should be in some smart parent component.

    const valueChanges$ = this.change$.pipe(map(() => this.form.value));

    setInterval(() => {
      console.log(this.form.value.address);
      console.log(this.form.value.address === initialFormValue.address);
    }, 1000);

    valueChanges$.subscribe((value) => {
      console.log(value.address);
      console.log(value.address === initialFormValue.address);
    });

    valueChanges$
      .pipe(map((value) => diff(initialValue, value)))
      .subscribe(console.log);

    // .pipe(map((value) => diff(initialValue, value)))
    // .subscribe(console.log);
  }

  someInputChange() {
    this.change$.next();
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-root',
  template: ` 
    <mc-dynamic-form [definition]="definition"></mc-dynamic-form> `,
})
export class AppComponent {
  definition: ModelDefinition = [
    {
      name: 'title',
      type: FieldType.Text,
      placeholder: 'Hello',
    },
    {
      name: 'test',
      type: FieldType.Text,
      placeholder: 'test',
    },
    {
      name: 'price',
      type: FieldType.Number,
    },
  ];
}
