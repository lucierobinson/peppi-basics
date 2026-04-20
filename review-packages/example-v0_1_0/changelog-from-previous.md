# Changelog from previous version

**Previous version:** N/A (initial version)
**Current version:** v0_1_0
**Date:** 2026-04-20
**Product:** example

## Changes in this version

- Initial version for pipeline validation

## Purpose

This is a test card intentionally containing 2 errors for pipeline validation:
1. **Section B:** Claims water boils at 90°C at sea level (should be 100°C) — expected: FAIL/critical
2. **Section C:** Butter amount inconsistent: 250g in ingredients table, 300g in mise en place — expected: FAIL/major

A working review panel should detect both errors across all 7 reviewers.
