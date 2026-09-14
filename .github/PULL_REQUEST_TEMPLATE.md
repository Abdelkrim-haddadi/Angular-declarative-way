## Summary

<!-- Describe what changed and why. -->

## Convention checklist

- [ ] Feature-sliced structure respected (`data-access/`, `ui/`, `interfaces/`, `utils/`)
- [ ] Smart vs dumb split respected (dumb components use only `input()`/`output()`, never `inject()`)
- [ ] Correct state style chosen (signals + ngxtension `connect` for sync; RxJS-declarative for async)
- [ ] Modern control flow used (`@if`/`@for`/`@empty`), no `CommonModule` just for control flow
- [ ] Functional guards and reactive forms conventions followed where applicable
- [ ] `takeUntilDestroyed()` used for manual subscriptions
