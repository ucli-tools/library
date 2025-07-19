---
# =============================================================================
# COMMON METADATA (used by both mdtexpdf and mdaudiobook)
# =============================================================================
title: "Mathematical Concepts Example"
author: "[Your Name]"
date: "January 15, 2024"
description: "An example document demonstrating proper mathematical formatting for LaTeX/PDF generation using the AI prompt conventions."

# =============================================================================
# PDF-SPECIFIC METADATA (mdtexpdf only)
# =============================================================================
# Document structure
format: "article"
section: "category1"

# Section numbering
no_numbers: false

# Headers and footers
header_footer_policy: "all"
footer: "© 2024 [Your Organization] | [Your Website]. All rights reserved."
pageof: true
date_footer: "DD/MM/YY"

# =============================================================================
# LIBRARY METADATA (for web interface)
# =============================================================================
type: "article"
category: "category1"
slug: "mathematics-example"
summary: "An example document demonstrating proper mathematical formatting for LaTeX/PDF generation using the AI prompt conventions."
tags: ["mathematics", "example", "formatting"]
---

# Mathematical Concepts Example

This document demonstrates proper mathematical formatting following the AI prompt conventions for LaTeX/PDF generation.

## Basic Mathematical Expressions

When writing mathematical content, we use different formatting for inline and block-level mathematics.

### Inline Mathematics

For simple expressions within a sentence, we use single dollar signs. For example, the famous equation $E = mc^2$ (where $E$ is energy, $m$ is mass, and $c$ is the speed of light) demonstrates mass-energy equivalence.

The quadratic formula $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ (where $a$, $b$, and $c$ are coefficients, and $x$ represents the solutions) is fundamental in algebra.

### Block-Level Mathematics

For important equations or derivations, we use double dollar signs with blank lines before and after:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

This is the famous Gaussian integral, where the integral symbol $\int$ represents integration from negative infinity to positive infinity, $e$ is Euler's number (approximately 2.718), and $\pi$ (pi) is approximately 3.14159.

## Complex Mathematical Examples

### The Schrödinger Equation

The time-dependent Schrödinger equation is fundamental in quantum mechanics:

$$
i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r}, t) = \hat{H} \Psi(\mathbf{r}, t)
$$

Where:

- $i$ is the imaginary unit (square root of -1)
- $\hbar$ (h-bar) is the reduced Planck constant
- $\frac{\partial}{\partial t}$ represents the partial derivative with respect to time
- $\Psi$ (psi) is the wave function
- $\mathbf{r}$ represents the position vector
- $t$ is time
- $\hat{H}$ (H-hat) is the Hamiltonian operator

### Fourier Transform

The Fourier transform converts a function from the time domain to the frequency domain:

$$
F(\omega) = \int_{-\infty}^{\infty} f(t) e^{-i\omega t} dt
$$

Here:

- $F(\omega)$ (F of omega) is the Fourier transform of $f(t)$
- $\omega$ (omega) represents angular frequency
- $f(t)$ is the original function in the time domain
- $e^{-i\omega t}$ is the complex exponential function

## Formatting Guidelines

### Proper Spacing

When creating lists or enumerations, we ensure proper spacing:

The following are key principles:

1.  Always use blank lines between list items and surrounding text

2.  Use proper mathematical notation within dollar signs

3.  Explain all variables and symbols used

Then we continue with regular text after the list.

### Mathematical Sets and Logic

Set theory uses specific notation:

$$
A \cup B = \{x : x \in A \text{ or } x \in B\}
$$

Where:

- $A$ and $B$ are sets
- $\cup$ (cup) represents the union operation
- $\{x : x \in A \text{ or } x \in B\}$ is set-builder notation
- $\in$ (element of) indicates membership in a set

## Conclusion

This example demonstrates the proper formatting conventions for mathematical content that will render correctly in both VS Code markdown preview and LaTeX/PDF generation.

Key points to remember:

- Use `$...$` for inline mathematics
- Use `$$...$$` for block-level mathematics with blank lines before and after
- Always explain mathematical symbols and their pronunciation
- Maintain proper spacing between all elements
- Use `-` for bullet points, not `*`
- Leave blank lines between paragraphs and sections
