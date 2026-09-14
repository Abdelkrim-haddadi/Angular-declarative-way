---
applyTo: "**/*.component.ts"
---

# Reactive forms conventions

Apply when a component builds a reactive form.

## Rules
- Build with `inject(FormBuilder).nonNullable.group({...})`.
- Import `ReactiveFormsModule`.
- Sync validators inline; **async validators** as the 3rd argument of a control.
- Cross-field validators at the **group** level via `{ validators: [...] }`.
- Dynamic lists via `FormArray` (`fb.array([])`, `.push(...)`).
- Bridge status to a signal with `toSignal(control.statusChanges)`.
- Sync a signal into the form with an `effect()` (`patchValue` / `reset`).
- Custom validators live in `utils/` as `ValidatorFn` (sync) or async `ValidatorFn` returning `Observable<ValidationErrors | null>`.

## Example
```ts
private fb = inject(FormBuilder);

myForm = this.fb.nonNullable.group(
  {
    username: ['', Validators.required, usernameAvailableValidator],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    guests: this.fb.array([]),
  },
  { validators: [passwordMatchesValidator] },
);

usernameStatus = toSignal(this.myForm.controls.username.statusChanges);

addGuest() {
  this.myForm.controls.guests.push(this.fb.control('', Validators.required));
}
```
